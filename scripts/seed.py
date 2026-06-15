from uuid import UUID

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.legal import DocumentChunk, LegalDocument, LegalSection, LegalSource, Organization, SourceType, User
from app.services.ai_provider import AIProvider

SOURCES = [
    ("Constitucion Politica del Peru", SourceType.constitution, "https://www.congreso.gob.pe/constitucion", 100, 10, 0.99),
    ("El Peruano", SourceType.law, "https://elperuano.pe", 90, 10, 0.985),
    ("SPIJ", SourceType.law, "https://spij.minjus.gob.pe", 88, 9, 0.98),
    ("Ministerio de Justicia y Derechos Humanos", SourceType.ministry_guidance, "https://www.gob.pe/minjus", 70, 8, 0.94),
    ("SUNAFIL", SourceType.agency_resolution, "https://www.gob.pe/sunafil", 68, 8, 0.93),
]


def main() -> None:
    ai = AIProvider()
    demo_org_id = UUID("00000000-0000-0000-0000-000000000001")
    with SessionLocal() as db:
        org = db.get(Organization, demo_org_id)
        if not org:
            org = Organization(id=demo_org_id, name="LUKE Demo Legal", slug="luke-demo")
            db.add(org)
        if not db.query(User).filter_by(email="admin@luke.pe").first():
            db.add(User(organization_id=org.id, email="admin@luke.pe", full_name="LUKE Admin", password_hash=hash_password("luke-demo"), role="admin"))

        created = {}
        for name, source_type, url, authority, freshness, reliability in SOURCES:
            source = db.query(LegalSource).filter_by(name=name).first()
            if not source:
                source = LegalSource(name=name, source_type=source_type, base_url=url, authority_level=authority, freshness_priority=freshness, reliability_score=reliability)
                db.add(source)
                db.flush()
            created[name] = source

        if not db.query(LegalDocument).filter_by(title="Codigo Civil Peruano - muestra controlada").first():
            doc = LegalDocument(
                source_id=created["SPIJ"].id,
                title="Codigo Civil Peruano - muestra controlada",
                document_type=SourceType.law,
                official_url="https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H682684",
                storage_uri="seed://codigo-civil-muestra",
                status="completed",
            )
            db.add(doc)
            db.flush()
            body = (
                "Articulo 1351.- El contrato es el acuerdo de dos o mas partes para crear, regular, modificar o extinguir una relacion juridica patrimonial. "
                "Esta muestra controlada existe para probar la arquitectura de citas; en produccion debe reemplazarse por texto oficial verificado."
            )
            section = LegalSection(document_id=doc.id, section_label="Articulo 1351", title="Definicion de contrato", body=body)
            db.add(section)
            db.flush()
            db.add(DocumentChunk(section_id=section.id, chunk_index=0, content=body, embedding=ai.embed(body), metadata={"seed": True}))
        db.commit()
        print("Seeded LUKE demo data. Login: admin@luke.pe / luke-demo")


if __name__ == "__main__":
    main()

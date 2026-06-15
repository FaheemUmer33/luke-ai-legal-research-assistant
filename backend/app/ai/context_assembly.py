def assemble_context(evidence) -> str:
    return "\n\n".join(
        f"[{index}] {item.document_name} | {item.section_label} | {item.official_url or item.storage_uri}\n{item.content}"
        for index, item in enumerate(evidence, start=1)
    )


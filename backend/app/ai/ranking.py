def rank_evidence(evidence):
    return sorted(
        evidence,
        key=lambda item: (item.authority_level, getattr(item, "freshness_priority", 0), item.reliability_score),
        reverse=True,
    )


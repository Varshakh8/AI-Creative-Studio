from app.models import AIUsage

def track_usage(db, user_id: int, feature: str):
    usage = db.query(AIUsage).filter_by(
        user_id=user_id,
        feature=feature
    ).first()

    if usage:
        usage.count += 1
    else:
        usage = AIUsage(
            user_id=user_id,
            feature=feature,
            count=1
        )
        db.add(usage)

    db.commit()

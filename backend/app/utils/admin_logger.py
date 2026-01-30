from app.models import AdminLog

def log_admin_action(db, admin_username: str, action: str):
    log = AdminLog(
        admin_username=admin_username,
        action=action
    )
    db.add(log)
    db.commit()

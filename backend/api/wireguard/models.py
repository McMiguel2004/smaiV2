from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from ..auth.models import db, User

class WireguardConfig(db.Model):
    __tablename__ = 'wireguard_configs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    wireguard_conf = db.Column(db.Text, nullable=False)
    wireguard_public_key = db.Column(db.String(255), nullable=False)
    wireguard_private_key = db.Column(db.String(255), nullable=False)
    wireguard_ip = db.Column(db.String(15), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with User
    user = db.relationship('User', backref=db.backref('wireguard_config', uselist=False, cascade='all, delete-orphan'))

    def to_dict(self):
        """Convert the object to a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'wireguard_public_key': self.wireguard_public_key,
            'wireguard_ip': self.wireguard_ip,
            'created_at': self.created_at.isoformat()
        }

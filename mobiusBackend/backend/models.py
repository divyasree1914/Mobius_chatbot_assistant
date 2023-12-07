from flask_mongoengine import MongoEngine
from mongoengine import  EmbeddedDocumentField
from mongoengine import Document, DateTimeField, StringField,ReferenceField,ListField
from datetime import datetime


db = MongoEngine()
class User(db.Document):
    user_id = db.StringField(primarykey = True)
    user_name = db.StringField(required = True)
    logo =db.FileField()  #file field for storing images
    timestamp = db.DateTimeField(default=datetime.utcnow)

class Assistant_Gaian(db.Document):
    assistant_name = db.StringField(required = True,primarykey = True)
    assistant_id = db.StringField(required = True,primarykey= True)
    created_timestamp = db.DateTimeField(default=datetime.utcnow)
    updation_timestamp = db.DateTimeField(default=datetime.utcnow)
    logo  =db.FileField() 

class Assistant_User(db.Document):
    user_id=db.StringField()
    assistant_user_id = db.StringField()
    assistant_user_name=db.StringField()
    timestamp = db.DateTimeField(default=datetime.utcnow)
    updated_timestamp=db.DateTimeField(default=datetime.utcnow)
    logo = db.StringField()

    
class Thread(db.Document):
    user_id =db.StringField()
    assistant_id =db.StringField()
    thread_id =db.StringField(required=True)
    timestamp = db.DateTimeField(default=datetime.utcnow)
    title =db.StringField()

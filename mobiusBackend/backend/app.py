from flask import Flask,request,jsonify
from flask_mongoengine import MongoEngine
from models import User,Assistant_Gaian,Assistant_User,Thread
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['MONGODB_SETTINGS'] = {
    'db': 'assistantBot',
    'host': 'mongodb+srv://divyasreemannava:chat@cluster0.9x90s8n.mongodb.net/?retryWrites=true&w=majority',
}
print("connected to db")
db = MongoEngine(app)
@app.route("/createUser",methods=["POST"])
def create():
    try:
        data = request.get_json()
        print(data)
        user = User(
            user_id=data['user_id'],
            user_name = data['user_name']
        )
        user.save()
        return jsonify({"message":"user details stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})


#Create Assistant Gaian
@app.route("/createAssistant",methods=["POST"])
def createAssistantGaian():
    data = request.get_json()
    print(data)
    assistant = Assistant_Gaian(
        assistant_name=data['assistant_name'],
        assistant_id = data['assistant_id']
    )
    assistant.save()
    return jsonify({"message":"Assistant details stored successfully"})

#get all assistants from assistant gaian
@app.route("/getAssistant",methods=["GET"])
def getAssistantGaian():
    gaianAssistant = Assistant_Gaian.objects().all()
    gaian_assistants_data = [
            {
                'assistant_name': assistant.assistant_name,
                'assistant_id': assistant.assistant_id,
            }
            for assistant in gaianAssistant
        ]
    print(gaian_assistants_data)
    return jsonify({"gaian_assistant":gaian_assistants_data})


# create user assistant for particular  userid
@app.route("/userAssistant",methods=["POST"])
def createUserAssistant():
    try:
        data = request.get_json()
        user_assistant = Assistant_User(
            user_id = data["user_id"],
            assistant_user_name=data['assistant_user_name'],
            assistant_user_id = data['assistant_user_id']
        )
        user_assistant.save()
    except Exception as e:
        return jsonify({"error": str(e)}) 
    return jsonify({"message":"User Assistant details stored successfully"})

#get user assistant by using user_id
@app.route("/getuserAssistant",methods=["GET"])
def assistants():
    try:
        # Retrieve user_id and assistant_id from request parameters
        user_id = request.args.get('user_id')
        if not user_id :
            return jsonify({"error": "user_id are required parameters."}),         
        assistant_user_objects = Assistant_User.objects(user_id=user_id)
        assistant_user_data = [
            {
                'assistant_name': assistant.assistant_user_name,
                'assistant_id': assistant.assistant_user_id,
            }
            for assistant in assistant_user_objects
        ]

        return jsonify({"assistant_objects": assistant_user_data})

    except Exception as e:
        return jsonify({"error": str(e)})

#create threads
@app.route('/createthreads', methods=['POST'])
def create_threads():
    try:
        data = request.get_json()
        user_id = data['user_id']
        assistant_id = data['assistant_id']
        # Create Thread document with references to User and Assistant_Gaian
        thread_data = Thread(
            user_id=user_id,  
            assistant_id=assistant_id,  
            thread_id=data['thread_id'],
            title=data['title']
        )
        # Save the Thread document
        thread_data.save()
        print(thread_data)
        return jsonify({"message": "Thread created successfully"})
    except Exception as e:
        print(e)
        return jsonify({"error message":e})

#get all threads for particular user_id and assistant_id
@app.route("/getAllThreads", methods=["GET"])
def getAllThreads():
    user_id = request.args.get('user_id')
    assistantId = request.args.get('assistantId')
    # print(assistantId)
    if not user_id or not assistantId:
        return jsonify({"error": "user_id and assistant_id are required parameters."}), 400

    threads = Thread.objects(user_id=user_id,assistant_id=assistantId).all()
    threads_data = [{"thread_id": thread.thread_id, "thread_title": thread.title} for thread in threads]
    # print(threads)
    return jsonify({"messages": threads_data})


@app.route("/thread",methods=["DELETE"])
def deleteThreads():
    thread_id = request.args.get('thread_id')
    print(thread_id)
    try:
        thread_to_delete = Thread.objects.get(thread_id=thread_id)
        thread_to_delete.delete()
        return jsonify({"message": "Thread deleted successfully."})
    except Thread.DoesNotExist:
        return jsonify({"error": "Thread not found."})

if __name__ =="__main__":
    app.run(port=8000)

# print("app is run at port 8000")
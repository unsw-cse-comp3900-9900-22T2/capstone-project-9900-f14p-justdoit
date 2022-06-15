from flask import jsonify


def hello_world():  # put application's code here
    return jsonify({'msg': 'hello world'})

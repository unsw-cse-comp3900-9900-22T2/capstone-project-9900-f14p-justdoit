from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists
import time


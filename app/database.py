import os
import click
from pymongo import MongoClient
from flask import current_app, g
from flask_pymongo import PyMongo
from langchain_ollama import ChatOllama, OllamaLLM


def get_db():
    if "db" not in g:
        # Docker Container
        mongo = PyMongo(current_app)
        g.db = mongo.db

        # Flask Development Server
        # client = MongoClient(
        #     port=27017,
        #     username="admin",
        #     password="1234",
        #     authSource="testDB"
        # )
        # g.db = client["testDB"]
    return g.db

def get_llm():
    llm = OllamaLLM(
        model="llama3.2",
        base_url=os.environ["LLAMA_BASE_URL"],
        # base_url="https://0e81-2406-7400-43-d6bd-e59d-a145-5631-b520.ngrok-free.app",
        temperature=0,
    )
    return llm


def close_db(e=None):
    db = g.pop("db", None)

@click.command("init-db")
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo("Initialized the database")
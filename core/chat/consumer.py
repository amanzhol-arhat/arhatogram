import json
import uuid

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder

from core.chat.models import Conversation, Message


def stringify_uuids(obj):
    if isinstance(obj, uuid.UUID):
        return str(obj)
    if isinstance(obj, dict):
        return {k: stringify_uuids(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [stringify_uuids(item) for item in obj]
    return obj


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get("message") or data.get("content")
        sender_id = data.get("sender_id") or data.get("sender_public_id")

        if not content or not sender_id:
            print("Error: missing message or sender_id")
            return

        new_msg = await self.save_message(sender_id, content)

        if new_msg:
            serialized_data = await self.get_serialized_message(new_msg)

            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat_message", "data": serialized_data}
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["data"], cls=DjangoJSONEncoder))

    @database_sync_to_async
    def save_message(self, sender_id, text):
        from core.user.models import User

        try:
            sender = User.objects.get(public_id=sender_id)
        except (User.DoesNotExist, ValueError):
            print(f"User with public_id {sender_id} not found.")
            return None

        try:
            conversation = Conversation.objects.get(public_id=self.room_name)
        except Conversation.DoesNotExist:
            print(f"Conversation {self.room_name} not found.")
            return None

        return Message.objects.create(
            conversation=conversation, sender=sender, content=text
        )

    @database_sync_to_async
    def get_serialized_message(self, message_instance):
        from core.chat.serializers import MessageSerializer

        data = MessageSerializer(message_instance, context={"request": None}).data
        return stringify_uuids(data)

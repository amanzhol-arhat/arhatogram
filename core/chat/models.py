from django.db import models

from core.abstract.models import AbstractManager, AbstractModel


class ConversationManager(AbstractManager):
    pass


class Conversation(AbstractModel):
    participants = models.ManyToManyField(
        "core_user.User", related_name="conversations"
    )
    objects = ConversationManager()

    def __str__(self):
        return f"Conversation: {self.public_id}"


class MessageManager(AbstractManager):
    pass


class Message(AbstractModel):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        "core_user.User", on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    edited = models.BooleanField(default=False)
    objects = MessageManager()

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"

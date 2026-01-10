from rest_framework import serializers

from core.abstract.serializers import AbstractSerializer
from core.chat.models import Conversation, Message
from core.user.serializers import UserSerializer


class MessageSerializer(AbstractSerializer):
    sender = UserSerializer(read_only=True)

    conversation = serializers.SlugRelatedField(
        queryset=Conversation.objects.all(), slug_field="public_id"
    )

    class Meta:
        model = Message
        fields = [
            "id",
            "public_id",
            "conversation",
            "sender",
            "content",
            "edited",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "public_id", "edited"]


class ConversationSerializer(AbstractSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "public_id",
            "other_user",
            "last_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "public_id"]

    def get_other_user(self, instance):
        request = self.context.get("request")
        participant = instance.participants.exclude(id=request.user.id).first()
        return UserSerializer(participant, context=self.context).data

    def get_last_message(self, instance):
        last_message = instance.messages.last()
        if last_message:
            return MessageSerializer(last_message, context=self.context).data
        return None

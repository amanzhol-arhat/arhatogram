from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.abstract.viewsets import AbstractViewSet
from core.chat.models import Conversation, Message
from core.chat.serializers import ConversationSerializer, MessageSerializer
from core.user.models import User


class ConversationViewSet(AbstractViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def create(self, request, *args, **kwargs):
        user_public_id = request.data.get("user_public_id")
        if not user_public_id:
            return Response(
                {"detail": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            other_user = User.objects.get(public_id=user_public_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        conversation = (
            Conversation.objects.filter(participants=request.user)
            .filter(participants=other_user)
            .first()
        )

        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, other_user)

        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageViewSet(AbstractViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    ordering = ["created_at"]

    def get_queryset(self):
        conversation_pk = self.request.query_params.get("conversation_id")
        if conversation_pk:
            return Message.objects.filter(
                conversation__public_id=conversation_pk,
                conversation__participants=self.request.user,
            )
        return Message.objects.none()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

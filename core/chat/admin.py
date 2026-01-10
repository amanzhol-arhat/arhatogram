from django.contrib import admin

from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    fields = ("sender", "content", "created_at", "edited")
    readonly_fields = ("created_at",)
    can_delete = True


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("public_id", "display_participants", "created_at", "updated_at")
    search_fields = ("public_id", "participants__username")
    list_filter = ("created_at",)
    filter_horizontal = ("participants",)
    inlines = [MessageInline]

    def display_participants(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])

    display_participants.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "conversation_link",
        "short_content",
        "created_at",
        "edited",
    )
    list_filter = ("edited", "created_at", "sender")
    search_fields = ("content", "sender__username", "conversation__public_id")
    readonly_fields = ("public_id", "created_at", "updated_at")

    def short_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    short_content.short_description = "Message Content"

    def conversation_link(self, obj):
        return f"Chat: {obj.conversation.public_id[:8]}..."

    conversation_link.short_description = "Conversation"

from celery import shared_task
from django.core.cache import cache


@shared_task
def add(x, y):
    """
    Тестовая задача. Celery сложит числа и вернет результат.
    """
    result = x + y
    print(f"I am a worker! Calculation result: {result}")
    return result


@shared_task
def clear_cache(key_pattern):
    """
    Пример полезной задачи: очистка кэша в фоне
    """
    cache.delete_pattern(key_pattern)
    return f"Cache cleared for pattern: {key_pattern}"

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import connection
import time

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        db_healthy = False
        db_type = 'unknown'
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
                db_healthy = True
                db_type = connection.vendor
        except Exception as e:
            db_healthy = False
            db_type = f"error: {str(e)}"

        return Response({
            'status': 'ok' if db_healthy else 'degraded',
            'timestamp': int(time.time()),
            'database': {
                'connected': db_healthy,
                'vendor': db_type,
            },
            'version': '1.0.0',
            'store': 'Vegist Organic Grocery Platform'
        })

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.token_url = '/api/v1/auth/token/'
        self.me_url = '/api/v1/auth/me/'

    def test_user_registration_success(self):
        payload = {
            "username": "sarah_organic",
            "email": "sarah@example.com",
            "first_name": "Sarah",
            "last_name": "Ahmed",
            "password": "StrongPassword123!",
            "password_confirm": "StrongPassword123!",
            "phone": "+923001234567",
            "address": "Street 12, Gulberg",
            "city": "Lahore",
            "postal_code": "54000"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertTrue(User.objects.filter(username="sarah_organic").exists())
        self.assertEqual(User.objects.get(username="sarah_organic").profile.city, "Lahore")

    def test_registration_password_mismatch(self):
        payload = {
            "username": "mismatch_user",
            "email": "mismatch@example.com",
            "password": "Password1234!",
            "password_confirm": "DifferentPassword123!",
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_obtain_and_me_profile(self):
        user = User.objects.create_user(username="testuser", email="test@example.com", password="TestPassword123!")
        user.profile.city = "Islamabad"
        user.profile.save()

        # Login
        login_res = self.client.post(self.token_url, {
            "username": "testuser",
            "password": "TestPassword123!"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        access_token = login_res.data['access']

        # Fetch Profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['username'], "testuser")
        self.assertEqual(me_res.data['profile']['city'], "Islamabad")

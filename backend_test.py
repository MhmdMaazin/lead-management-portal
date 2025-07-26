#!/usr/bin/env python3

import requests
import json
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE_URL = f"{BASE_URL}/api"

print(f"Testing Lead Management Portal API at: {API_BASE_URL}")
print("=" * 60)

def test_api_health():
    """Test basic API health check"""
    print("\n1. Testing API Health Check")
    print("-" * 30)
    
    try:
        response = requests.get(f"{API_BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "Lead Management Portal API" in data.get('message', ''):
                print("✅ API Health Check: PASSED")
                return True
            else:
                print("❌ API Health Check: FAILED - Unexpected response message")
                return False
        else:
            print("❌ API Health Check: FAILED - Non-200 status code")
            return False
            
    except Exception as e:
        print(f"❌ API Health Check: FAILED - Exception: {str(e)}")
        return False

def test_leads_endpoints():
    """Test all leads CRUD operations"""
    print("\n2. Testing Leads Endpoints")
    print("-" * 30)
    
    results = []
    created_lead_id = None
    
    # Test GET /api/leads (initially empty)
    try:
        print("\n2.1 Testing GET /api/leads")
        response = requests.get(f"{API_BASE_URL}/leads")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            leads = response.json()
            print(f"Initial leads count: {len(leads)}")
            print("✅ GET /api/leads: PASSED")
            results.append(True)
        else:
            print("❌ GET /api/leads: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ GET /api/leads: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test POST /api/leads (create new lead)
    try:
        print("\n2.2 Testing POST /api/leads")
        lead_data = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "company": "Tech Solutions Inc",
            "phone": "+1-555-0123",
            "position": "CTO",
            "status": "new",
            "source": "website"
        }
        
        response = requests.post(f"{API_BASE_URL}/leads", json=lead_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_lead = response.json()
            created_lead_id = created_lead.get('id')
            print(f"Created lead ID: {created_lead_id}")
            print(f"Created lead: {created_lead}")
            print("✅ POST /api/leads: PASSED")
            results.append(True)
        else:
            print("❌ POST /api/leads: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ POST /api/leads: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test GET /api/leads/{id} (get specific lead)
    if created_lead_id:
        try:
            print(f"\n2.3 Testing GET /api/leads/{created_lead_id}")
            response = requests.get(f"{API_BASE_URL}/leads/{created_lead_id}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                lead = response.json()
                print(f"Retrieved lead: {lead}")
                print("✅ GET /api/leads/{id}: PASSED")
                results.append(True)
            else:
                print("❌ GET /api/leads/{id}: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ GET /api/leads/{{id}}: FAILED - Exception: {str(e)}")
            results.append(False)
    
    # Test PUT /api/leads/{id} (update lead)
    if created_lead_id:
        try:
            print(f"\n2.4 Testing PUT /api/leads/{created_lead_id}")
            update_data = {
                "status": "contacted",
                "notes": "Initial contact made via email"
            }
            
            response = requests.put(f"{API_BASE_URL}/leads/{created_lead_id}", json=update_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                updated_lead = response.json()
                print(f"Updated lead: {updated_lead}")
                print("✅ PUT /api/leads/{id}: PASSED")
                results.append(True)
            else:
                print("❌ PUT /api/leads/{id}: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ PUT /api/leads/{{id}}: FAILED - Exception: {str(e)}")
            results.append(False)
    
    # Test DELETE /api/leads/{id} (delete lead) - We'll do this at the end
    
    return results, created_lead_id

def test_saved_leads_endpoints(lead_id=None):
    """Test saved leads endpoints"""
    print("\n3. Testing Saved Leads Endpoints")
    print("-" * 30)
    
    results = []
    
    # Test GET /api/saved-leads (initially empty)
    try:
        print("\n3.1 Testing GET /api/saved-leads")
        response = requests.get(f"{API_BASE_URL}/saved-leads")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            saved_leads = response.json()
            print(f"Initial saved leads count: {len(saved_leads)}")
            print("✅ GET /api/saved-leads: PASSED")
            results.append(True)
        else:
            print("❌ GET /api/saved-leads: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ GET /api/saved-leads: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test POST /api/saved-leads (save a lead)
    if lead_id:
        try:
            print("\n3.2 Testing POST /api/saved-leads")
            save_data = {
                "leadId": lead_id,
                "userId": "test-user-123"
            }
            
            response = requests.post(f"{API_BASE_URL}/saved-leads", json=save_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                saved_lead = response.json()
                print(f"Saved lead: {saved_lead}")
                print("✅ POST /api/saved-leads: PASSED")
                results.append(True)
            else:
                print("❌ POST /api/saved-leads: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ POST /api/saved-leads: FAILED - Exception: {str(e)}")
            results.append(False)
        
        # Test DELETE /api/saved-leads/{id} (remove saved lead)
        try:
            print(f"\n3.3 Testing DELETE /api/saved-leads/{lead_id}")
            response = requests.delete(f"{API_BASE_URL}/saved-leads/{lead_id}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Delete result: {result}")
                print("✅ DELETE /api/saved-leads/{id}: PASSED")
                results.append(True)
            else:
                print("❌ DELETE /api/saved-leads/{id}: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ DELETE /api/saved-leads/{{id}}: FAILED - Exception: {str(e)}")
            results.append(False)
    
    return results

def test_prospection_leads_endpoints(lead_id=None):
    """Test prospection leads endpoints"""
    print("\n4. Testing Prospection Leads Endpoints")
    print("-" * 30)
    
    results = []
    
    # Test GET /api/prospection-leads (initially empty)
    try:
        print("\n4.1 Testing GET /api/prospection-leads")
        response = requests.get(f"{API_BASE_URL}/prospection-leads")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            prospection_leads = response.json()
            print(f"Initial prospection leads count: {len(prospection_leads)}")
            print("✅ GET /api/prospection-leads: PASSED")
            results.append(True)
        else:
            print("❌ GET /api/prospection-leads: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ GET /api/prospection-leads: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test POST /api/prospection-leads (add to prospection)
    if lead_id:
        try:
            print("\n4.2 Testing POST /api/prospection-leads")
            prospection_data = {
                "leadId": lead_id,
                "userId": "test-user-123"
            }
            
            response = requests.post(f"{API_BASE_URL}/prospection-leads", json=prospection_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                prospection_lead = response.json()
                print(f"Prospection lead: {prospection_lead}")
                print("✅ POST /api/prospection-leads: PASSED")
                results.append(True)
            else:
                print("❌ POST /api/prospection-leads: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ POST /api/prospection-leads: FAILED - Exception: {str(e)}")
            results.append(False)
        
        # Test DELETE /api/prospection-leads/{id} (remove from prospection)
        try:
            print(f"\n4.3 Testing DELETE /api/prospection-leads/{lead_id}")
            response = requests.delete(f"{API_BASE_URL}/prospection-leads/{lead_id}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Delete result: {result}")
                print("✅ DELETE /api/prospection-leads/{id}: PASSED")
                results.append(True)
            else:
                print("❌ DELETE /api/prospection-leads/{id}: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ DELETE /api/prospection-leads/{{id}}: FAILED - Exception: {str(e)}")
            results.append(False)
    
    return results

def test_contact_history_endpoints(lead_id=None):
    """Test contact history endpoints"""
    print("\n5. Testing Contact History Endpoints")
    print("-" * 30)
    
    results = []
    
    # Test GET /api/contact-history (initially empty)
    try:
        print("\n5.1 Testing GET /api/contact-history")
        response = requests.get(f"{API_BASE_URL}/contact-history")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            contact_history = response.json()
            print(f"Initial contact history count: {len(contact_history)}")
            print("✅ GET /api/contact-history: PASSED")
            results.append(True)
        else:
            print("❌ GET /api/contact-history: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ GET /api/contact-history: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test POST /api/contact-history (add contact record)
    if lead_id:
        try:
            print("\n5.2 Testing POST /api/contact-history")
            contact_data = {
                "leadId": lead_id,
                "type": "email",
                "recipient": "john.smith@example.com",
                "subject": "Follow-up on our conversation",
                "content": "Hi John, Thank you for your time yesterday. I wanted to follow up on our discussion about your technology needs.",
                "status": "sent",
                "userId": "test-user-123"
            }
            
            response = requests.post(f"{API_BASE_URL}/contact-history", json=contact_data)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                contact_record = response.json()
                print(f"Contact record: {contact_record}")
                print("✅ POST /api/contact-history: PASSED")
                results.append(True)
            else:
                print("❌ POST /api/contact-history: FAILED")
                results.append(False)
                
        except Exception as e:
            print(f"❌ POST /api/contact-history: FAILED - Exception: {str(e)}")
            results.append(False)
    
    return results

def test_email_and_mail_endpoints():
    """Test email and mail sending endpoints"""
    print("\n6. Testing Email and Mail Endpoints")
    print("-" * 30)
    
    results = []
    
    # Test POST /api/send-email
    try:
        print("\n6.1 Testing POST /api/send-email")
        email_data = {
            "to": "john.smith@example.com",
            "subject": "Welcome to our service",
            "content": "Dear John, Welcome to our lead management platform. We're excited to work with you!"
        }
        
        response = requests.post(f"{API_BASE_URL}/send-email", json=email_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            email_record = response.json()
            print(f"Email record: {email_record}")
            print("✅ POST /api/send-email: PASSED")
            results.append(True)
        else:
            print("❌ POST /api/send-email: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ POST /api/send-email: FAILED - Exception: {str(e)}")
        results.append(False)
    
    # Test POST /api/send-mail
    try:
        print("\n6.2 Testing POST /api/send-mail")
        mail_data = {
            "to": "John Smith\n123 Business Ave\nSuite 100\nBusiness City, BC 12345",
            "content": "Dear Mr. Smith,\n\nWe would like to introduce our new lead management solution that can help streamline your sales process.\n\nBest regards,\nSales Team"
        }
        
        response = requests.post(f"{API_BASE_URL}/send-mail", json=mail_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            mail_record = response.json()
            print(f"Mail record: {mail_record}")
            print("✅ POST /api/send-mail: PASSED")
            results.append(True)
        else:
            print("❌ POST /api/send-mail: FAILED")
            results.append(False)
            
    except Exception as e:
        print(f"❌ POST /api/send-mail: FAILED - Exception: {str(e)}")
        results.append(False)
    
    return results

def test_delete_lead(lead_id):
    """Test DELETE /api/leads/{id} - done at the end to clean up"""
    print(f"\n7. Testing DELETE /api/leads/{lead_id}")
    print("-" * 30)
    
    try:
        response = requests.delete(f"{API_BASE_URL}/leads/{lead_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Delete result: {result}")
            print("✅ DELETE /api/leads/{id}: PASSED")
            return True
        else:
            print("❌ DELETE /api/leads/{id}: FAILED")
            return False
            
    except Exception as e:
        print(f"❌ DELETE /api/leads/{{id}}: FAILED - Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("Starting Lead Management Portal Backend API Tests")
    print("=" * 60)
    
    all_results = []
    
    # 1. Test API health
    health_result = test_api_health()
    all_results.append(health_result)
    
    if not health_result:
        print("\n❌ API is not responding. Stopping tests.")
        return
    
    # 2. Test leads endpoints
    leads_results, created_lead_id = test_leads_endpoints()
    all_results.extend(leads_results)
    
    # 3. Test saved leads endpoints
    saved_results = test_saved_leads_endpoints(created_lead_id)
    all_results.extend(saved_results)
    
    # 4. Test prospection leads endpoints
    prospection_results = test_prospection_leads_endpoints(created_lead_id)
    all_results.extend(prospection_results)
    
    # 5. Test contact history endpoints
    contact_results = test_contact_history_endpoints(created_lead_id)
    all_results.extend(contact_results)
    
    # 6. Test email and mail endpoints
    email_mail_results = test_email_and_mail_endpoints()
    all_results.extend(email_mail_results)
    
    # 7. Clean up - delete the created lead
    if created_lead_id:
        delete_result = test_delete_lead(created_lead_id)
        all_results.append(delete_result)
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = sum(all_results)
    total_tests = len(all_results)
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! The Lead Management Portal API is working correctly.")
    else:
        print(f"\n⚠️  {total_tests - passed_tests} test(s) failed. Please check the output above for details.")

if __name__ == "__main__":
    main()
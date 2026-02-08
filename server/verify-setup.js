"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_URL = 'http://localhost:3000/api';
async function verify() {
    console.log('🚀 Starting Verification...');
    // 1. Register User
    console.log('\nTesting Registration...');
    const registerRes = await (0, node_fetch_1.default)(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test Admin',
            email: `admin_${Date.now()}@test.com`,
            password: 'password123',
            role: 'admin'
        })
    });
    if (!registerRes.ok) {
        console.error('Registration failed:', await registerRes.text());
        return;
    }
    const registerData = await registerRes.json();
    console.log('✅ Registered:', registerData.user.email);
    const token = registerData.token;
    // 2. Login (Optional since we got token, but good to test)
    console.log('\nTesting Login...');
    const loginRes = await (0, node_fetch_1.default)(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: registerData.user.email,
            password: 'password123'
        })
    });
    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }
    const loginData = await loginRes.json();
    console.log('✅ Logged in. Token:', loginData.token ? 'Present' : 'Missing');
    // 3. Create Course (Protected)
    console.log('\nTesting Create Course (Protected)...');
    const courseRes = await (0, node_fetch_1.default)(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Computer Science ' + Date.now(),
            code: 'CS' + Date.now(),
            credits: 120
        })
    });
    if (!courseRes.ok) {
        console.error('Create Course failed:', await courseRes.text());
        return;
    }
    const course = await courseRes.json();
    console.log('✅ Course Created:', course.name);
    // 4. Get Courses (Public/Protected check)
    console.log('\nTesting Get Courses...');
    const getCoursesRes = await (0, node_fetch_1.default)(`${API_URL}/courses`);
    const courses = await getCoursesRes.json();
    console.log(`✅ Fetched ${courses.length} courses`);
    console.log('\n🎉 Verification Complete!');
}
verify().catch(console.error);
//# sourceMappingURL=verify-setup.js.map
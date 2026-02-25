const http = require('http');

function req(method, url, body, token) {
    return new Promise(resolve => {
        const u = new URL(url);
        const opts = {
            hostname: u.hostname, port: u.port, path: u.pathname, method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: 'Bearer ' + token } : {}),
                ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
            }
        };
        const r = http.request(opts, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => resolve({ s: res.statusCode, b: d }));
        });
        r.on('error', e => resolve({ s: 'ERR', b: e.message }));
        if (body) r.write(body);
        r.end();
    });
}

function ok(condition) { return condition ? '✅ PASS' : '❌ FAIL'; }
function line(title) { console.log('\n' + '─'.repeat(55)); console.log(' ' + title); console.log('─'.repeat(55)); }

async function run() {
    let r, data;

    line('1. SERVER HEALTH');
    r = await req('GET', 'http://localhost:5001/api/health');
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200), `HTTP ${r.s} | status: "${data.status}"`);

    line('2. /api/admin/users  (NO TOKEN) → expect 401');
    r = await req('GET', 'http://localhost:5001/api/admin/users');
    data = JSON.parse(r.b);
    console.log(ok(r.s === 401), `HTTP ${r.s} | message: "${data.message}"`);

    line('3. /api/dashboard/hr-summary  (NO TOKEN) → expect 401');
    r = await req('GET', 'http://localhost:5001/api/dashboard/hr-summary');
    data = JSON.parse(r.b);
    console.log(ok(r.s === 401), `HTTP ${r.s} | message: "${data.message}"`);

    line('4. /api/dashboard/admin-summary  (NO TOKEN) → expect 401');
    r = await req('GET', 'http://localhost:5001/api/dashboard/admin-summary');
    data = JSON.parse(r.b);
    console.log(ok(r.s === 401), `HTTP ${r.s} | message: "${data.message}"`);

    line('5. REGISTER new HR user');
    const reg = JSON.stringify({ name: 'RBAC Test HR', email: 'rbachr_v2@demo.com', password: 'Test1234', role: 'hr' });
    r = await req('POST', 'http://localhost:5001/api/auth/register', reg);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 201 && data.success), `HTTP ${r.s} | message: "${data.message}"`);
    let hrToken = data.data && data.data.token;

    line('6. LOGIN as HR user');
    const login = JSON.stringify({ email: 'rbachr_v2@demo.com', password: 'Test1234' });
    r = await req('POST', 'http://localhost:5001/api/auth/login', login);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | message: "${data.message}"`);
    if (data.data && data.data.token) hrToken = data.data.token;

    line('7. /api/dashboard/hr-summary  (HR TOKEN) → expect 200');
    r = await req('GET', 'http://localhost:5001/api/dashboard/hr-summary', null, hrToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | role: "${data.data && data.data.role}"`);
    if (data.data) console.log('   Summary:', JSON.stringify(data.data.summary));

    line('8. /api/admin/users  (HR TOKEN) → expect 403 Forbidden');
    r = await req('GET', 'http://localhost:5001/api/admin/users', null, hrToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 403), `HTTP ${r.s} | message: "${data.message}"`);

    line('9. LOGIN as ADMIN user');
    const adminLogin = JSON.stringify({ email: 'admin@example.com', password: 'password123' });
    r = await req('POST', 'http://localhost:5001/api/auth/login', adminLogin);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | role: "${data.data && data.data.user && data.data.user.role}"`);
    const adminToken = data.data && data.data.token;

    line('10. /api/admin/users  (ADMIN TOKEN) → expect 200');
    r = await req('GET', 'http://localhost:5001/api/admin/users', null, adminToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | total users: ${data.data && data.data.pagination && data.data.pagination.total}`);

    line('11. /api/admin/system-stats  (ADMIN TOKEN) → expect 200');
    r = await req('GET', 'http://localhost:5001/api/admin/system-stats', null, adminToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | users.total: ${data.data && data.data.users && data.data.users.total}`);

    line('12. /api/dashboard/admin-summary  (ADMIN TOKEN) → expect 200');
    r = await req('GET', 'http://localhost:5001/api/dashboard/admin-summary', null, adminToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 200 && data.success), `HTTP ${r.s} | role: "${data.data && data.data.role}"`);

    line('13. /api/dashboard/hr-summary  (ADMIN TOKEN) → expect 403');
    r = await req('GET', 'http://localhost:5001/api/dashboard/hr-summary', null, adminToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 403), `HTTP ${r.s} | message: "${data.message}"`);

    line('14. /api/admin/system-stats  (HR TOKEN) → expect 403');
    r = await req('GET', 'http://localhost:5001/api/admin/system-stats', null, hrToken);
    data = JSON.parse(r.b);
    console.log(ok(r.s === 403), `HTTP ${r.s} | message: "${data.message}"`);

    console.log('\n' + '═'.repeat(55));
    console.log(' ALL RBAC VERIFICATION TESTS COMPLETE');
    console.log('═'.repeat(55) + '\n');
}

run();

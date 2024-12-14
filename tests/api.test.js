const request = require('supertest');
const app = require('../index'); // Import your Express app
const mongoose = require('mongoose');

describe('API Endpoints', () => {
    let token; // Store JWT token for authenticated routes

    beforeAll(async () => {
        const testDb = process.env.TEST_DB;
        await mongoose.connect(testDb, { dbName: 'TaskFlowTestDB' });
        // Create a test user and get a token
        await request(app).post('/auth/signup').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        const res = await request(app).post('/auth/signin').send({
            email: 'testuser@example.com',
            password: 'password123'
        });
        token = res.body.token;
    });

    afterAll(async () => {
        // Clean up database and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const res = await request(app).post('/auth/signup').send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Signup successful');
    });

    it('should authenticate an existing user', async () => {
        const res = await request(app).post('/auth/signin').send({
            email: 'testuser@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/dashboard/task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                task: 'Test Task',
                desc: 'This is a test task',
                status: 'Todo',
                start: new Date(),
                finish: new Date()
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task created successfully');
    });

    it('should fetch all tasks for the user', async () => {
        const res = await request(app)
            .get('/dashboard/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.tasks).toBeInstanceOf(Array);
    });

    it('should update a task by ID', async () => {
        // First, create a task
        const task = await request(app)
            .post('/dashboard/task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                task: 'Update Task',
                status: 'Todo'
            });

        const res = await request(app)
            .put(`/dashboard/task/${task.body.task._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'In Progress' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.task.status).toBe('In Progress');
    });

    it('should delete a task by ID', async () => {
        // First, create a task
        const task = await request(app)
            .post('/dashboard/task')
            .set('Authorization', `Bearer ${token}`)
            .send({
                task: 'Delete Task',
                status: 'Todo'
            });

        const res = await request(app)
            .delete(`/dashboard/task/${task.body.task._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task deleted successfully');
    });
});
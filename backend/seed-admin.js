import bcrypt from 'bcrypt';
import { User, sequelize } from './models/index.js';

const seedAdmin = async () => {
    try {
        // Authenticate database connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Admin details from user request
        const adminEmail = 'admin@admin.com';
        const adminPassword = 'admin@123';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);

        // Check if admin exists
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password and role...');
            await existingAdmin.update({
                passwordHash,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                profilePicture: '/default-avatar.png'
            });
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                passwordHash,
                role: 'admin',
                dateOfBirth: '1990-01-01',
                gender: 'other',
                phoneNumber: '0000000000',
                address: 'Admin Base',
                profilePicture: '/default-avatar.png'
            });
            console.log('Admin user seeded successfully.');
        }

    } catch (error) {
        console.error('Unable to seed admin user:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedAdmin();

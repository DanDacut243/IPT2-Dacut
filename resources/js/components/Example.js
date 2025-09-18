import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Example() {
    console.log('Example component is rendering!');
    const [studentId, setStudentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [students, setStudents] = useState([]);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const fetchStudents = async () => {
        try {
            const res = await axios.get('/students');
            setStudents(res.data);
        } catch (e) {
            console.error('Failed to fetch students', e);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        try {
            if (editingStudentId) {
                // Update existing student (use PATCH for partial updates)
                const res = await axios.patch(`/students/${editingStudentId}`, {
                    student_id: studentId,
                    first_name: firstName,
                    last_name: lastName,
                    middle_name: middleName || null,
                });
                setMessage('Student updated');
                // replace student in list
                setStudents((prev) => prev.map((s) => (s.id === res.data.student.id ? res.data.student : s)));
                setEditingStudentId(null);
            } else {
                // Create new student
                const res = await axios.post('/students', {
                    student_id: studentId,
                    first_name: firstName,
                    last_name: lastName,
                    middle_name: middleName || null,
                });
                setMessage('Student created');
                setStudents((prev) => [res.data.student, ...prev]);
            }

            // Reset form
            setStudentId('');
            setFirstName('');
            setLastName('');
            setMiddleName('');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setMessage(editingStudentId ? 'Error updating student' : 'Error creating student');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this student?')) return;
        try {
            await axios.delete(`/students/${id}`);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            console.error('Failed to delete student', e);
        }
    };

    const handleEdit = (student) => {
        setEditingStudentId(student.id);
        setStudentId(student.student_id || '');
        setFirstName(student.first_name || '');
        setLastName(student.last_name || '');
        setMiddleName(student.middle_name || '');
        setErrors({});
        setMessage('');
        // scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingStudentId(null);
        setStudentId('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setErrors({});
        setMessage('');
    };

    const fieldError = (key) => {
        const v = errors[key];
        if (!v) return null;
        return Array.isArray(v) ? v.join(' ') : v;
    };

    return (
        <div className="example-page">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm card-custom">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Students</h5>
                                <small className="text-muted">Manage student records</small>
                            </div>
                            <div className="card-body">
                                {message && (
                                    <div className="alert alert-info py-2">{message}</div>
                                )}

                                <form onSubmit={handleSubmit} className="row g-3 align-items-end form-custom">
                                    <div className="col-md-6">
                                        <label className="form-label">Student ID</label>
                                        <input
                                            className={`form-control input-lg ${errors.student_id ? 'is-invalid' : ''}`}
                                            placeholder="e.g. 312312312"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                        />
                                        {errors.student_id && (
                                            <div className="invalid-feedback d-block">
                                                {fieldError('student_id')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            className={`form-control input-lg ${errors.first_name ? 'is-invalid' : ''}`}
                                            placeholder="First name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        {errors.first_name && (
                                            <div className="invalid-feedback d-block">
                                                {fieldError('first_name')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            className={`form-control input-lg ${errors.last_name ? 'is-invalid' : ''}`}
                                            placeholder="Last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                        {errors.last_name && (
                                            <div className="invalid-feedback d-block">
                                                {fieldError('last_name')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Middle Name</label>
                                        <input
                                            className={`form-control input-lg ${errors.middle_name ? 'is-invalid' : ''}`}
                                            placeholder="Middle name (optional)"
                                            value={middleName}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                        />
                                        {errors.middle_name && (
                                            <div className="invalid-feedback d-block">
                                                {fieldError('middle_name')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12 d-flex gap-2">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            {editingStudentId ? 'Update' : 'Save'}
                                        </button>
                                        {editingStudentId && (
                                            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={cancelEdit}>
                                                Cancel
                                            </button>
                                        )}
                                        <div className="ms-auto text-muted align-self-center small">{students.length} records</div>
                                    </div>
                                </form>

                                <hr className="my-4" />

                                <div className="table-responsive">
                                    <table className="table table-striped table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Student ID</th>
                                                <th>First</th>
                                                <th>Last</th>
                                                <th>Middle</th>
                                                <th style={{ width: 110 }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((s) => (
                                                <tr key={s.id}>
                                                    <td>{s.student_id}</td>
                                                    <td>{s.first_name}</td>
                                                    <td>{s.last_name}</td>
                                                    <td>{s.middle_name || ''}</td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => handleEdit(s)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(s.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {students.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-muted py-3">
                                                        No students yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

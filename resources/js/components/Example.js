import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Example() {
    console.log('Example component is rendering!');
    const [studentId, setStudentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [students, setStudents] = useState([]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/students');
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
            const res = await axios.post('http://127.0.0.1:8000/api/students', {
                student_id: studentId,
                first_name: firstName,
                last_name: lastName,
                middle_name: middleName || null,
            });
            setMessage('Student created');
            setStudentId('');
            setFirstName('');
            setLastName('');
            setMiddleName('');
            setStudents((prev) => [res.data.student, ...prev]);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setMessage('Error creating student');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this student?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/students/${id}`);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            console.error('Failed to delete student', e);
        }
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
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <h5 className="mb-0">Students</h5>
                            </div>
                            <div className="card-body">
                                {message && (
                                    <div className="alert alert-info py-2">{message}</div>
                                )}

                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Student ID</label>
                                        <input
                                            className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                                            placeholder="e.g. 2025-0001"
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
                                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Juan"
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
                                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Dela Cruz"
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
                                        <label className="form-label">Middle Name (optional)</label>
                                        <input
                                            className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Santos"
                                            value={middleName}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                        />
                                        {errors.middle_name && (
                                            <div className="invalid-feedback d-block">
                                                {fieldError('middle_name')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
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
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(s.id)}
                                                        >
                                                            Delete
                                                        </button>
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

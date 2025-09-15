<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class student extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'student_details';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'middle_name',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

<?php

// app/Models/ToDo.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToDo extends Model
{
    use HasFactory;

    protected $table = 'to_dos'; // Specify the correct table name

    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'deadline',
        'user_id',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

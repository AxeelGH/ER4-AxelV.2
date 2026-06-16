<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HighScore extends Model
{
    protected $table = 'highscores';
    protected $fillable = ['name', 'score'];
    public $timestamps = false;
}

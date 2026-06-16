<?php
use App\Http\Controllers\HighScoreController;
use Illuminate\Support\Facades\Route;

Route::get('/highscores', [HighScoreController::class, 'index']);
Route::post('/highscores', [HighScoreController::class, 'store']);
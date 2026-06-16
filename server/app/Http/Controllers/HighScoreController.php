<?php
namespace App\Http\Controllers;

use App\Models\HighScore;
use Illuminate\Http\Request;

class HighScoreController extends Controller {

    public function index() {
        $scores = HighScore::orderBy('score', 'desc')->limit(20)->get();
        return response()->json($scores);
    }

    public function store(Request $request) {
        $score = HighScore::create([
            'name' => $request->name,
            'score' => $request->score,
        ]);
        return response()->json(['success' => true]);
    }
}

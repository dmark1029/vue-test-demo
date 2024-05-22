<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', 'python');
        $cacheKey = 'github_search_results';
        // Cache the results for 5 minutes
        $data = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query) {
            $response = Http::get('https://api.github.com/search/repositories', [
                'q' => $query
            ]);

            if ($response->successful()) {
                return $response->json();
            }
            return null;
        });

        if ($data === null) {
            return response()->json(['error' => 'Unable to fetch data from GitHub'], 500);
        }

        return response()->json($data, 200);
    }
}
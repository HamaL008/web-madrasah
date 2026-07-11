<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Map username field to email for Laravel Auth
        $credentials = [
            'email' => $credentials['username'] . '@admin.local',
            'password' => $credentials['password'],
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Username atau password salah.'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

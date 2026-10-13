<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
  protected $rootView = 'app';

  public function version(Request $request): ?string
  {
      return parent::version($request);
  }

  public function share(Request $request): array
  {
    $user = $request->user();
    
      return array_merge(parent::share($request), [
          'auth' => [
              'user' => $user ? [
                'user_id' => $user->user_id,
                'username' => $user->name,
                'role' => $user->role,
              ] : null,
          ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
      ]);
  }
}

<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Api\CompanyController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn(): Response => Inertia::render('dashboard'))->name('dashboard');
    
    // Company routes
    Route::get('company', [CompanyController::class, 'index'])->name('company');
    Route::post('company', [CompanyController::class, 'store'])->name('company.store');
    Route::get('company/{id}', [CompanyController::class, 'show'])->name('company.show');
    Route::put('company/{id}', [CompanyController::class, 'update'])->name('company.update');
    Route::delete('company/{id}', [CompanyController::class, 'destroy'])->name('company.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

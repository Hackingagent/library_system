<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_book', function (Blueprint $table) {
            $table->id();
                        // Connect to students table
            $table->foreignId('student_id')
                  ->constrained('students')
                  ->cascadeOnDelete();

            // Connect to books table
            $table->foreignId('book_id')
                  ->constrained('books')
                  ->cascadeOnDelete();

            // Prevent duplicate relationships
            $table->unique(['student_id', 'book_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_books');
    }
};

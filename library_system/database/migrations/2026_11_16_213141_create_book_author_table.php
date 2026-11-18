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
        Schema::create('book_author', function (Blueprint $table) {
            $table->id();

            // Connect to books table
            $table->foreignId('book_id')
                  ->constrained('books')
                  ->cascadeOnDelete();

            // Connect to authors table
            $table->foreignId('author_id')
                  ->constrained('authors')
                  ->cascadeOnDelete();

            // Prevent duplicate author-book relationships
            $table->unique(['book_id', 'author_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_authors');
    }
};

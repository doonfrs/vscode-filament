<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filament UI Test</title>
</head>
<body>
    <div>
    <div class="flex"></div>
    
        <h1>Filament UI Components</h1>
        <x-filament::avatar src="https://example.com/image.jpg" alt="Description" size="sm" :circular="true">
        <x-filament::avatar src="https://example.com/image.jpg" alt="Description" size="sm" :circular="true">

        <!-- Badge component -->
        <div class="mt-4">
            <x-filament::badge>New</x-filament::badge>
            <x-filament::badge>Featured</x-filament::badge>
        </div>

        <x-filament::avatar src="https://example.com/image.jpg" alt="Description" size="sm" :circular="true">

        <x-filament::breadcrumbs 
        :breadcrumbs="[
            ['label' => 'Home', 'url' => '/'],
            ['label' => 'Current Page'],
        ]" />
        
        <!-- Dropdown component -->
        <div class="mt-4">
            <x-filament::dropdown>
                <x-slot name="trigger">
                    <x-filament::button>
                        Options
                    </x-filament::button>
                </x-slot>
                
                <x-filament::dropdown.item wire:click="option1">
                    Option 1
                </x-filament::dropdown.item>
                
                <x-filament::dropdown.item wire:click="option2">
                    Option 2
                </x-filament::dropdown.item>
            </x-filament::dropdown>
        </div>
        
        <!-- Avatar component -->
        <div class="mt-4">
            <h3>Avatars</h3>
            <div class="flex items-center gap-4">
                <x-filament::avatar
                    src="https://filamentphp.com/dan.jpg"
                    alt="Dan Harrin"
                />
                <x-filament::avatar
                    src="https://filamentphp.com/dan.jpg"
                    alt="Dan Harrin"
                    size="sm"
                />
                <x-filament::avatar
                    src="https://filamentphp.com/dan.jpg"
                    alt="Dan Harrin"
                    size="lg"
                />
                <x-filament::avatar
                    src="https://filamentphp.com/dan.jpg"
                    alt="Dan Harrin"
                    :circular="false"
                />
            </div>
        </div>

        <!-- Breadcrumbs component -->
        <div class="mt-4">
            <x-filament::breadcrumbs :breadcrumbs="[
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'Users', 'url' => '/users'],
                ['label' => 'Create User'],
            ]" />
        </div>

        <!-- Link component -->
        <div class="mt-4">
            <x-filament::link 
                href="#"
                color="primary"
                icon="heroicon-m-arrow-right"
                size="lg"
            >
                View more
            </x-filament::link>
        </div>


        <!-- Tabs component -->
        <div class="mt-4">
            <x-filament::tabs>
                <x-filament::tabs.item active icon="heroicon-m-user">
                    <x-slot name="label">
                        Profile
                    </x-slot>
                    
                    Profile content here
                </x-filament::tabs.item>
                
                <x-filament::tabs.item icon="heroicon-m-cog-6-tooth">
                    <x-slot name="label">
                        Settings
                    </x-slot>
                    
                    Settings content here
                </x-filament::tabs.item>
            </x-filament::tabs>
        </div>

        <!-- Section component -->
        <div class="mt-4">
            <x-filament::section
                collapsible
                icon="heroicon-m-information-circle"
                icon-color="primary"
            >
                <x-slot name="heading">
                    Additional Information
                </x-slot>
                
                <x-slot name="description">
                    Here you can find more details about this record.
                </x-slot>
                
                This is the section content.
            </x-filament::section>
        </div>

        <!-- Pagination component -->
        <div class="mt-4">
            <div class="text-sm text-gray-500 mb-2">Pagination example (would work in Livewire):</div>
            <code>
                &lt;x-filament::pagination :paginator="$records" extreme-links /&gt;
            </code>
        </div>

        <!-- Loading indicator component -->
        <div class="mt-4">
            <h3>Loading Indicator</h3>
            <x-filament::loading-indicator class="w-6 h-6" />
        </div>
    </div>
</body>
</html> 
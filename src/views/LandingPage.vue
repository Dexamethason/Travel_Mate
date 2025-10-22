<script setup lang="ts">
import LandingNavbar from '@/components/LandingPage/LandingNavbar.vue';
import HeroSection from '@/components/LandingPage/HeroSection.vue';
import FeaturesSection from '@/components/LandingPage/FeatureSection.vue';
import HowItWorksSection from '@/components/LandingPage/HowItWorksSection.vue';
</script>

<template>
  <div class="min-h-screen bg-white">
    <LandingNavbar />

    <HeroSection id="hero" />
    <FeaturesSection id="features" />
    <HowItWorksSection id="how-it-works" />
  </div>
</template>

<script lang="ts">
  import { onMount } from "svelte";
  import { creneauxResponse } from "./constants";
  import { asyncData } from "./store";

  const getCreneauxDisponibles = async () => {
    return await creneauxResponse;
  };

  let rendezVousDone = false;

  let rendezVous = {
    etage:  "",
    appartement : "",
    typologie : "",
    surface : "",
    creneauSelectedId : ""
  }

  let etageError = '';
  let appartementError = '';
  let typologieError = '';
  let surfaceError = '';
  let creneauSelectedError = '';

  // let promiseCreneaux;

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:5173/src/creneaux.json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data);

      // Update the store with the fetched data
      asyncData.set(data);
    } catch (error) {
      console.error("Error fetching data:" + error);
    }
  }

  onMount(() => {
    console.log("oui");
    fetchData(); // Assuming fetchData is defined as above
  });

  const handleSubmit = () => {
    etageError = '';
    appartementError = '';
    typologieError = '';
    surfaceError = '';
    creneauSelectedError = '';

    if(!rendezVous.etage) {
      etageError = "Saisir l'étage";
    }

    if(!rendezVous.appartement) {
      appartementError = "Saisir l'appartement";
    }
    
    if(!rendezVous.typologie) {
      typologieError = "Saisir la typologie";
    }
    
    if(!rendezVous.surface) {
      surfaceError = "Saisir la surface";
    }

    if(!rendezVous.creneauSelectedId) {
      creneauSelectedError = "Saisir la surface";
    }

    if(!etageError && !appartementError && !typologieError && !surfaceError && !creneauSelectedError) {
      $asyncData = $asyncData.filter(elem => elem.id != rendezVous.creneauSelectedId);
    
      rendezVousDone = true;
    }
  };
</script>

<div>
  <h1>Visite logement pour DPE</h1>

  {#if rendezVousDone}
    <div class="alert alert-success" role="alert">
      A simple success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="mb-3">
      <label for="etage" class="form-label">Etage</label>
      {#if etageError}
        <p class="error-field">{etageError}</p>
      {/if}      
      <input type="text" class="form-control" id="etage" placeholder="" bind:value={rendezVous.etage}/>
    </div>
    <div class="mb-3">
      <label for="appart" class="form-label">Appartement</label>
      {#if appartementError}
      <p class="error-field">{appartementError}</p>
      {/if}  
      <input type="text" class="form-control" id="appart" placeholder="" bind:value={rendezVous.appartement}/>
    </div>
    <div class="mb-3">
      <label for="typologie" class="form-label">Typologie</label>
      {#if typologieError}
      <p class="error-field">{typologieError}</p>
      {/if}  
      <input type="text" class="form-control" id="typologie" placeholder="" bind:value={rendezVous.typologie}/>
    </div>
    <div class="mb-3">
      <label for="surface" class="form-label">Surface</label>
      {#if surfaceError}
      <p class="error-field">{surfaceError}</p>
      {/if}  
      <input type="text" class="form-control" id="surface" placeholder="" bind:value={rendezVous.surface}/>
    </div>

    <label for="reservation">Créneau souhaité :</label>
    <p class="error-field">{creneauSelectedError}</p>
    <select
      bind:value={rendezVous.creneauSelectedId}
      class="form-select"
      aria-label="Default select example"
      id="reservation"
    >
        <option value="" selected disabled>Sélectionner un créneau</option>
      {#each $asyncData as creneau}
        <option value={creneau.id}
          >{creneau.jour + " " + creneau.interval}</option
        >
      {/each}
    </select>

    <button class="btn btn-primary" type="submit">Envoyer</button>
  </form>
</div>

<style>
  label {
    display: inline-block;
    width: 200px;
  }

  button[type="submit"] {
    display: block;
    margin: auto;
    margin-top: 20px;
  }

  .error-field {
    color: red;
  }
</style>

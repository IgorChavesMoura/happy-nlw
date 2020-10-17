import React, { useState } from "react";

import { useHistory } from 'react-router-dom';

import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';


import { FiPlus, FiX } from "react-icons/fi";

import { Sidebar } from '../components';

import api from "../services/api";

import happyMapIcon from '../utils/mapIcon';

import '../styles/pages/create-orphanage.css';




export default function CreateOrphanage() {

  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleMapClick = (event: LeafletMouseEvent) => {

    const { lat: latitude, lng: longitude } = event.latlng;

    setPosition({ latitude, longitude });


  };

  const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {

    if(!event.target.files) {

      return;

    }

    const imagesList = Array.from(event.target.files);

    setImages(imagesList);
    setPreviewImages(imagesList.map(img => URL.createObjectURL(img)));


  };

  const handleRemoveImage = (index:number) => {

    images.splice(index,1);


    setImages([...images]);
    setPreviewImages(images.map(image => URL.createObjectURL(image)));

  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    event.stopPropagation();

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);

    data.append('latitude', String(position.latitude));
    data.append('longitude', String(position.longitude));

    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);

    data.append('open_on_weekends', String(openOnWeekends));

    images.forEach(image => data.append('images', image));

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');

  };

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-23.5806128, -46.6416567]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {
                (position.latitude != 0 && position.longitude != 0) && (
                  <Marker interactive={false} icon={happyMapIcon} position={[position.latitude, position.longitude]} />
                )

              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" value={about} onChange={e => setAbout(e.target.value)} maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {
                  previewImages.map((previewImage, index) => (
                    <div key={previewImage} className="preview-image">
                       <img src={previewImage} alt={name} />
                       <div onClick={() => handleRemoveImage(index)} className="remove-preview-image">
                        <FiX size={24} color="#FF669D" />
                       </div>
                    </div>
                  ))
                }

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>


              </div>
              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={openingHours} onChange={e => setOpeningHours(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button onClick={() => setOpenOnWeekends(true)} type="button" className={openOnWeekends ? 'active' : ''} >Sim</button>
                <button onClick={() => setOpenOnWeekends(false)} type="button" className={!openOnWeekends ? 'active' : ''} >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;

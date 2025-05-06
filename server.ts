import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Database } from './types/database.types';

dotenv.config();

const app = express();
const port = 4000;

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

app.use(cors());
app.use(express.json());

// Middleware para manejar errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Endpoint para obtener el primer ID de inquilino
app.get('/api/renters/first', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('renters')
      .select('id')
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.json({ id: null });
    }

    res.json({ id: data[0].id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener el ID del primer inquilino' });
  }
});

// Endpoint para obtener detalles del inquilino
app.get('/api/renters/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos del inquilino
    const { data: renter, error: renterError } = await supabase
      .from('renters')
      .select('*')
      .eq('id', id)
      .single();

    if (renterError) throw renterError;

    // Obtener reseñas
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('renter_id', id)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;

    // Obtener historial de alquiler
    const { data: rentalHistory, error: rentalError } = await supabase
      .from('rental_history')
      .select('*')
      .eq('renter_id', id)
      .order('start_date', { ascending: false });

    if (rentalError) throw rentalError;

    res.json({
      renter,
      reviews,
      rentalHistory
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del inquilino' });
  }
});

// Endpoint para añadir una reseña
app.post('/api/renters/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, hostData } = req.body;

    if (!rating || !comment || !hostData) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const newReview = {
      renter_id: id,
      host_id: hostData.host_id,
      host_name: hostData.host_name,
      host_picture: hostData.host_picture,
      rating,
      comment
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(newReview)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al añadir la reseña' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
}); 
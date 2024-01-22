import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
      
      Te serán provistos textos en español con posibles errores otrográficos y gramaticales,
      las palabras usadas deben existir en el diccionario de la RAE,
      debes de responder en formato JSON,
      tu tarea es corregirlos y retornar información de las soluciones,
      también debes retornar un porcentaje de acierto para el usuario,

      Si no hay errores, debes de retornar un mensaje de felicitaciones.
      
      Ejemplo de salida:

       {
        userScore: number,
        errors: string[], // ['error -> solución']
        message: string, // usa emojis y texto para felicitar al usuario
       }

      `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4',
    temperature: 0.3,
    max_tokens: 150,
  });

  return JSON.parse(completion.choices[0].message.content);
};

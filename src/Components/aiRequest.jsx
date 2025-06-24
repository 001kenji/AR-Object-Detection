import { useState } from "react"

// pollination ai method
// const usePollinationsTextGen = () => {
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)
  
//     const generateText = async (prompt) => {
//       setLoading(true)
//       setError(null)
  
//       try {
//         const res = await fetch('https://text.pollinations.ai/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             messages: prompt,
//           }),
//         })
  
//         if (!res.ok) throw new Error(`API error: ${res.status}`)
  
//         const data = await res.text()
//         const content = data || ''
//         console.log('http content is :',content)
//         return content // ← now returns content directly
//       } catch (err) {
//         setError(err.message)
//         throw err
//       } finally {
//         setLoading(false)
//       }
//     }
  
//     return { loading, error, generateText }
//   }
  

const useGeminiTextGen = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateText = async (messages) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: messages, // must be formatted correctly below
          }),
        }
      )

      if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)

      const data = await res.json()
      const content =
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
    //   console.log('Gemini content:', content)
      return content
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, generateText }
}

export default useGeminiTextGen

//   export default usePollinationsTextGen
  
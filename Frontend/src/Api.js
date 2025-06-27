const API_BASE_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000'
export const authToken = import.meta.env.VITE_VIDEOSDK_AUTHTOKEN || 'your-default-auth-token'

// Create a new meeting room
export const createMeeting = async ({ token = authToken }) => {
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const { roomId } = await res.json()
    console.log("Created Room ID:", roomId)
    return roomId
  } catch (error) {
    console.error("Error creating meeting:", error)
    throw error
  }
}

// Get authentication token from backend
export const getToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const token = await response.json()
    return token
  } catch (err) {
    console.error("Error in getToken:", err)
    throw err
  }
}

// Get meeting ID from backend
export const getMeetingId = async (token) => {
  try {
    const VIDEOSDK_API_ENDPOINT = `${API_BASE_URL}/create-meeting`
    const OPTIONS = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token
      })
    }

    const response = await fetch(VIDEOSDK_API_ENDPOINT, OPTIONS)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { meetingId } = await response.json()
    return meetingId
  } catch (err) {
    console.error("Error in getMeetingId:", err)
    throw err
  }
}

// Validate meeting ID
export const validateMeeting = async (meetingId, token = authToken) => {
  try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms/validate/${meetingId}`, {
      method: "GET",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const result = await res.json()
    return result.roomId === meetingId
  } catch (error) {
    console.error("Error validating meeting:", error)
    return false
  }
}
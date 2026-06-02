export const getLaunches = async () => {
    const response = await fetch("https://api.spacexdata.com/v5/launches");

    if(!response.ok) {
        throw new Error("Error al obtener lanzamientos");
    }

    return response.json();
}

export const getLaunchpads = async () => {
    const response = await fetch("https://api.spacexdata.com/v4/launchpads");

    if(!response.ok) {
        throw new Error("Error al obtener las ubicaciones");
    }

    return response.json();
}
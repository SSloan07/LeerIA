from app.models.entities import SubjectCreate, SubjectUpdate
from fastapi import APIRouter, HTTPException 
from app.database.database_call import supabase
from uuid import UUID


router = APIRouter()

@router.post("/")
def create_subject(subject: SubjectCreate):
    data = subject.model_dump(mode = "json")
    
    try: 
        response = (supabase.table("subjects").insert(data).execute())

        return {
            "message": "Acabas de crear una materia correctamente",
            "data": response.data
        }
    
    except Exception as error: 

        raise HTTPException(
            status_code = 500, 
            detail =f"Al crear la materia. Error {str(error)}"
        )


@router.get("/{subject_id}")
def read_specific_subject(subject_id: UUID):
    try:
        response = ( supabase.table("subjects").select("*").eq("id", str(subject_id)).execute())

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Materia no encontrada"
            )

        return {
            "message": "Materia encontrada",
            "data": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar materia específica: {str(error)}"
        )
    
@router.get("/")
def read_all_subject(): 

    try: 
        response = (supabase.table("subjects").select("*").execute())
        return {
            "message": "Materias existentes obtenidas satisfactoriamente", 
            "data": response.data
        }
    except Exception as error: 
        raise HTTPException(
            status_code = 500, 
            detail = f"Al traer materias existentes. Error{str(error)}"
        )
    
@router.put("/{subject_id}")
def update_specific_subject(subject_id: UUID, subject: SubjectUpdate):
    data = subject.model_dump(mode="json", exclude_none=True, exclude_unset=True) # Este exclude_unset sirve para que se dejen los valores antiguos si yo no los modifico

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No enviaste datos para actualizar"
        )

    try:
        response = (
            supabase
            .table("subjects")
            .update(data)
            .eq("id", str(subject_id))
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Materia no encontrada"
            )

        return {
            "message": "Materia actualizada correctamente",
            "data": response.data[0]
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar materia: {str(error)}"
        )
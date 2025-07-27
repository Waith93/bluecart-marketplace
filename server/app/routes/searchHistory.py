# app/routes/search_history.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import SearchHistory, User
from typing import List

from app.database import get_db
from ..schema import SearchHistoryCreate, SearchHistoryOut
from app.routes.auth import get_current_user

router = APIRouter(tags=["SearchHistory"])

@router.post("/", response_model=SearchHistoryOut)
def save_search(data: SearchHistoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Save a new search to history"""
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    search = SearchHistory(
        user_id=user.id,
        query=data.query,
        platforms=data.platforms,
        total_results=data.total_results
    )

    try:
        db.add(search)
        db.commit()
        db.refresh(search)
        return search
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save search history")

@router.get("/", response_model=List[SearchHistoryOut])
def get_user_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get search history for the current user"""
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        history = db.query(SearchHistory).filter(
            SearchHistory.user_id == user.id
        ).order_by(SearchHistory.timestamp.desc()).all()
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get search history")

@router.delete("/{history_id}")
def delete_search_history(history_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Delete a specific search history entry"""
    history = db.query(SearchHistory).filter(
        SearchHistory.id == history_id,
        SearchHistory.user_id == user.id
    ).first()
    
    if not history:
        raise HTTPException(status_code=404, detail="History entry not found")
    
    try:
        db.delete(history)
        db.commit()
        return {"message": "History entry deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete history entry")

@router.delete("/")
def clear_all_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Clear all search history for the current user"""
    try:
        deleted_count = db.query(SearchHistory).filter(SearchHistory.user_id == user.id).delete()
        db.commit()
        return {"message": f"Deleted {deleted_count} history entries"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to clear history")

@router.get("/stats")
def get_history_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get search history statistics for the current user"""
    try:
        total_searches = db.query(SearchHistory).filter(SearchHistory.user_id == user.id).count()
        
        if total_searches == 0:
            return {
                "total_searches": 0,
                "most_searched_platforms": [],
                "recent_searches": []
            }
        
        history = db.query(SearchHistory).filter(
            SearchHistory.user_id == user.id
        ).order_by(SearchHistory.timestamp.desc()).all()
        
        # Calculate platform usage
        platform_counts = {}
        for search in history:
            for platform in search.platforms:
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
        
        most_used_platforms = sorted(platform_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Get recent searches (last 5)
        recent_searches = [
            {
                "query": search.query,
                "platforms": search.platforms,
                "timestamp": search.timestamp.isoformat() if search.timestamp else None
            } for search in history[:5]
        ]
        
        return {
            "total_searches": total_searches,
            "most_searched_platforms": [
                {"platform": platform, "count": count} 
                for platform, count in most_used_platforms[:5]
            ],
            "recent_searches": recent_searches
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get statistics")
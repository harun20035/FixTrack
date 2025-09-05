import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def fix_survey_table():
    """Ažurira Survey tabelu sa novim kolonama"""
    
    # Konekcija na bazu
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "fixtrack"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "password")
    )
    
    cur = conn.cursor()
    
    try:
        # Proveri da li kolone postoje
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'survey' AND column_name IN ('satisfaction_level', 'issue_category', 'suggestions', 'contact_preference')
        """)
        existing_columns = [row[0] for row in cur.fetchall()]
        
        print(f"Existing columns: {existing_columns}")
        
        # Dodaj nove kolone ako ne postoje
        if 'satisfaction_level' not in existing_columns:
            cur.execute("ALTER TABLE survey ADD COLUMN satisfaction_level VARCHAR(50)")
            print("Added satisfaction_level column")
        
        if 'issue_category' not in existing_columns:
            cur.execute("ALTER TABLE survey ADD COLUMN issue_category VARCHAR(50)")
            print("Added issue_category column")
        
        if 'suggestions' not in existing_columns:
            cur.execute("ALTER TABLE survey ADD COLUMN suggestions TEXT")
            print("Added suggestions column")
        
        if 'contact_preference' not in existing_columns:
            cur.execute("ALTER TABLE survey ADD COLUMN contact_preference VARCHAR(10) DEFAULT 'no'")
            print("Added contact_preference column")
        
        # Ažuriraj postojeće redove sa default vrednostima
        cur.execute("""
            UPDATE survey 
            SET satisfaction_level = 'neutralan',
                issue_category = 'ostalo',
                contact_preference = 'no'
            WHERE satisfaction_level IS NULL OR issue_category IS NULL
        """)
        
        conn.commit()
        print("Survey table updated successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    fix_survey_table()

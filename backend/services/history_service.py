from repository.supabase_client import supabase
from datetime import date

def getMainData(year=None):
    try:
        if year is None:
            current_year = date.today().year -1
        else:
            current_year = int(year)

        previous_year = current_year - 1

        start_date = date(previous_year, 1, 1).isoformat()
        end_date = date(current_year, 12, 31).isoformat()

        response = (supabase.table("History")
                    .select("*")
                    .gte("Date", start_date)
                    .lte("Date", end_date)
                    .execute())
        response_data = sorted(response.data, key=lambda x: x['id'])
        
        return response_data
    except Exception as e:
        print(f"Error fetching data from Supabase: {e}")
        return []

from rdflib import Graph, Namespace
from kg_pipeline import ETourismKG


class SPARQLQueries:
    
    
    def __init__(self, kg):
        self.kg = kg
        self.ETOUR = kg.ETOUR
        self.EX = kg.EX
    
    def query_1_filter_high_rated(self):
        """
        Query 1: FILTER - Find high-rated accommodations (rating >= 4.0)
        Justification: Helps tourists find quality accommodations
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        PREFIX ex: <http://www.example.org/etourism/instances#>
        
        SELECT ?hotel ?name ?rating ?priceRange
        WHERE {
            ?hotel a etour:Hotel ;
                   etour:name ?name ;
                   etour:rating ?rating ;
                   etour:priceRange ?priceRange .
            FILTER (?rating >= 4.0)
        }
        ORDER BY DESC(?rating)
        """
        
        print("\n" + "="*70)
        print("QUERY 1: High-Rated Hotels (FILTER + ORDER BY)")
        print("="*70)
        print("Objective: Find hotels with rating >= 4.0, sorted by rating")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'Hotel':<30} {'Rating':<10} {'Price':<10}")
        print("-" * 50)
        
        count = 0
        for row in results:
            hotel_name = str(row.name)
            rating = float(row.rating)
            price = str(row.priceRange)
            print(f"{hotel_name:<30} {rating:<10.1f} {price:<10}")
            count += 1
        
        print(f"\n✓ Found {count} high-rated hotels")
        print("\nInterpretation: This query helps tourists quickly identify")
        print("quality accommodations, filtering out lower-rated options.")
        return results
    
    def query_2_group_by_city(self):
        """
        Query 2: GROUP BY + COUNT - Count hotels per city
        Justification: Shows accommodation availability by location
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        
        SELECT ?cityName (COUNT(?hotel) AS ?hotelCount)
        WHERE {
            ?hotel a etour:Hotel ;
                   etour:locatedIn ?city .
            ?city etour:name ?cityName .
        }
        GROUP BY ?cityName
        ORDER BY DESC(?hotelCount)
        """
        
        print("\n" + "="*70)
        print("QUERY 2: Hotels per City (GROUP BY + COUNT)")
        print("="*70)
        print("Objective: Count number of hotels in each city")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'City':<30} {'Number of Hotels':<20}")
        print("-" * 50)
        
        for row in results:
            city = str(row.cityName)
            count = int(row.hotelCount)
            print(f"{city:<30} {count:<20}")
        
        print("\nInterpretation: This aggregation reveals which cities have")
        print("more accommodation options, helping with travel planning.")
        return results
    
    def query_3_average_rating_by_type(self):
        """
        Query 3: GROUP BY + AVG - Average rating by attraction type
        Justification: Compare quality across different attraction categories
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?type (AVG(?rating) AS ?avgRating) (COUNT(?attraction) AS ?count)
        WHERE {
            ?attraction a ?type ;
                       etour:rating ?rating .
            ?type rdfs:subClassOf* etour:TouristAttraction .
            FILTER (?type != etour:TouristAttraction)
        }
        GROUP BY ?type
        ORDER BY DESC(?avgRating)
        """
        
        print("\n" + "="*70)
        print("QUERY 3: Average Rating by Attraction Type (AVG + GROUP BY)")
        print("="*70)
        print("Objective: Calculate average rating for each type of attraction")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'Attraction Type':<30} {'Avg Rating':<15} {'Count':<10}")
        print("-" * 55)
        
        for row in results:
            attr_type = str(row.type).split('#')[-1]
            avg = float(row.avgRating)
            count = int(row[2])
            print(f"{attr_type:<30} {avg:<15.2f} {count:<10}")
        
        print("\nInterpretation: This analysis helps identify which types")
        print("of attractions are generally better rated by visitors.")
        return results
    
    def query_4_filter_multiple_conditions(self):
        """
        Query 4: Complex FILTER - Find affordable hotels in specific city
        Justification: Budget-conscious travel planning
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        
        SELECT ?name ?rating ?priceRange ?capacity ?city
        WHERE {
            ?hotel a etour:Hotel ;
                   etour:name ?name ;
                   etour:rating ?rating ;
                   etour:priceRange ?priceRange ;
                   etour:capacity ?capacity ;
                   etour:locatedIn ?cityObj .
            ?cityObj etour:name ?city .
            
            FILTER (
                ?rating >= 3.5 && 
                (?priceRange = "$$" || ?priceRange = "$") &&
                ?city = "Oran"
            )
        }
        ORDER BY DESC(?rating)
        """
        
        print("\n" + "="*70)
        print("QUERY 4: Budget Hotels in Oran (Complex FILTER)")
        print("="*70)
        print("Objective: Find affordable ($ or $$) hotels in Oran with rating >= 3.5")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'Hotel':<25} {'Rating':<10} {'Price':<10} {'Capacity':<10}")
        print("-" * 55)
        
        count = 0
        for row in results:
            name = str(row.name)
            rating = float(row.rating)
            price = str(row.priceRange)
            capacity = int(row.capacity)
            print(f"{name:<25} {rating:<10.1f} {price:<10} {capacity:<10}")
            count += 1
        
        if count == 0:
            print("(No results found)")
        
        print(f"\n✓ Found {count} matching hotel(s)")
        print("\nInterpretation: This query demonstrates the power of combining")
        print("multiple filters to meet specific traveler requirements.")
        return results
    
    def query_5_aggregates_statistics(self):
        """
        Query 5: Multiple Aggregates - Overall accommodation statistics
        Justification: Get comprehensive market overview
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        
        SELECT 
            (COUNT(?hotel) AS ?totalHotels)
            (AVG(?rating) AS ?avgRating)
            (MAX(?rating) AS ?maxRating)
            (MIN(?rating) AS ?minRating)
            (SUM(?capacity) AS ?totalCapacity)
        WHERE {
            ?hotel a etour:Hotel ;
                   etour:rating ?rating ;
                   etour:capacity ?capacity .
        }
        """
        
        print("\n" + "="*70)
        print("QUERY 5: Hotel Market Statistics (Multiple Aggregates)")
        print("="*70)
        print("Objective: Calculate comprehensive statistics across all hotels")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        for row in results:
            print(f"Total Hotels:     {int(row.totalHotels)}")
            print(f"Average Rating:   {float(row.avgRating):.2f}")
            print(f"Highest Rating:   {float(row.maxRating):.1f}")
            print(f"Lowest Rating:    {float(row.minRating):.1f}")
            print(f"Total Capacity:   {int(row.totalCapacity)} guests")
        
        print("\nInterpretation: These aggregate statistics provide a market")
        print("overview useful for tourism planning and business analysis.")
        return results
    
    def query_6_proximity_recommendations(self):
        """
        Query 6: Graph Navigation - Find hotels near attractions
        Justification: Location-based recommendations
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        
        SELECT ?hotelName ?attractionName ?hotelRating
        WHERE {
            ?hotel a etour:Hotel ;
                   etour:name ?hotelName ;
                   etour:rating ?hotelRating ;
                   etour:nearTo ?attraction .
            ?attraction etour:name ?attractionName .
        }
        ORDER BY DESC(?hotelRating)
        """
        
        print("\n" + "="*70)
        print("QUERY 6: Hotels Near Attractions (Graph Navigation)")
        print("="*70)
        print("Objective: Find hotels with proximity to tourist attractions")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'Hotel':<30} {'Near':<30} {'Rating':<10}")
        print("-" * 70)
        
        count = 0
        for row in results:
            hotel = str(row.hotelName)
            attraction = str(row.attractionName)
            rating = float(row.hotelRating)
            print(f"{hotel:<30} {attraction:<30} {rating:<10.1f}")
            count += 1
        
        if count == 0:
            print("(No proximity relationships found)")
        
        print(f"\n✓ Found {count} hotel-attraction relationship(s)")
        print("\nInterpretation: This demonstrates the value of the knowledge")
        print("graph in connecting related entities for smart recommendations.")
        return results
    
    def query_7_activities_by_duration(self):
        """
        Query 7: FILTER + ORDER - Activities sorted by duration
        Justification: Time-based activity planning
        """
        query = """
        PREFIX etour: <http://www.semanticweb.org/ontologies/etourism#>
        
        SELECT ?activityName ?duration ?price ?type
        WHERE {
            ?activity a ?type ;
                     etour:name ?activityName ;
                     etour:duration ?duration ;
                     etour:price ?price .
            ?type rdfs:subClassOf* etour:Activity .
            FILTER (?type != etour:Activity)
            FILTER (?duration <= 240)
        }
        ORDER BY ?duration
        """
        
        print("\n" + "="*70)
        print("QUERY 7: Activities by Duration (FILTER + ORDER BY)")
        print("="*70)
        print("Objective: List activities under 4 hours, sorted by duration")
        print("\nSPARQL Query:")
        print(query)
        
        results = self.kg.query_graph(query)
        
        print("\nResults:")
        print(f"{'Activity':<35} {'Duration':<15} {'Price':<10}")
        print("-" * 60)
        
        for row in results:
            name = str(row.activityName)
            duration_min = int(row.duration)
            duration_hr = duration_min / 60
            price = float(row.price)
            print(f"{name:<35} {duration_hr:.1f}h ({duration_min}min)   ${price:.2f}")
        
        print("\nInterpretation: Sorting by duration helps tourists plan")
        print("their daily itineraries based on available time.")
        return results


def main():
    """Execute all advanced SPARQL queries"""
    print("="*70)
    print("TP2 - Advanced SPARQL Queries Demonstration")
    print("="*70)
    
    # Initialize KG
    print("\nInitializing Knowledge Graph...")
    kg = ETourismKG()
    
    # Load ontology and create instances
    kg.load_ontology("ontology/etourism_ontology.ttl")
    kg.create_instances()
    
    # Initialize query executor
    queries = SPARQLQueries(kg)
    
    # Execute all queries
    print("\n" + "="*70)
    print("EXECUTING ADVANCED SPARQL QUERIES")
    print("="*70)
    
    queries.query_1_filter_high_rated()
    queries.query_2_group_by_city()
    queries.query_3_average_rating_by_type()
    queries.query_4_filter_multiple_conditions()
    queries.query_5_aggregates_statistics()
    queries.query_6_proximity_recommendations()
    queries.query_7_activities_by_duration()
    
    print("\n" + "="*70)
    print("✓ All SPARQL queries executed successfully!")
    print("="*70)
    print("\nKey Features Demonstrated:")
    print("  ✓ FILTER with conditions")
    print("  ✓ GROUP BY with aggregates")
    print("  ✓ COUNT, AVG, MAX, MIN, SUM")
    print("  ✓ ORDER BY (ASC/DESC)")
    print("  ✓ Complex filtering")
    print("  ✓ Graph navigation")
    

if __name__ == "__main__":
    main()
from rdflib import Graph, Namespace, URIRef, Literal, RDF, RDFS, OWL
from rdflib.namespace import XSD
import os
from pathlib import Path


class ETourismKG:
    """Knowledge Graph Pipeline for e-Tourism Domain"""
    
    def __init__(self):
        """Initialize the KG with namespaces and empty graph"""
        self.graph = Graph()
        
        # Define namespaces
        self.ETOUR = Namespace("http://www.semanticweb.org/ontologies/etourism#")
        self.EX = Namespace("http://www.example.org/etourism/instances#")
        
        # Bind namespaces to graph
        self.graph.bind("etour", self.ETOUR)
        self.graph.bind("ex", self.EX)
        self.graph.bind("owl", OWL)
        self.graph.bind("xsd", XSD)
        
        print("✓ Knowledge Graph initialized")
    
    def load_ontology(self, ontology_path):
        """
        Step 1: Load the T-Box (ontology schema)
        """
        try:
            self.graph.parse(ontology_path, format="turtle")
            print(f"✓ Ontology loaded from: {ontology_path}")
            print(f"  Triples in graph: {len(self.graph)}")
        except Exception as e:
            print(f"✗ Error loading ontology: {e}")
            raise
    
    def create_instances(self):
        """
        Step 2: Create A-Box (instance data)
        Instantiate concrete tourism entities
        """
        print("\n--- Creating Instance Data (A-Box) ---")
        
        # Countries
        algeria = self.EX.Algeria
        self.graph.add((algeria, RDF.type, self.ETOUR.Country))
        self.graph.add((algeria, self.ETOUR.name, Literal("Algeria", lang="en")))
        self.graph.add((algeria, self.ETOUR.description, 
                       Literal("North African country with Mediterranean coastline")))
        
        france = self.EX.France
        self.graph.add((france, RDF.type, self.ETOUR.Country))
        self.graph.add((france, self.ETOUR.name, Literal("France", lang="en")))
        
        # Cities
        oran = self.EX.Oran
        self.graph.add((oran, RDF.type, self.ETOUR.City))
        self.graph.add((oran, self.ETOUR.name, Literal("Oran", lang="en")))
        self.graph.add((oran, self.ETOUR.description, 
                       Literal("Major port city in northwest Algeria")))
        self.graph.add((oran, self.ETOUR.locatedIn, algeria))
        
        algiers = self.EX.Algiers
        self.graph.add((algiers, RDF.type, self.ETOUR.City))
        self.graph.add((algiers, self.ETOUR.name, Literal("Algiers", lang="en")))
        self.graph.add((algiers, self.ETOUR.description, 
                       Literal("Capital and largest city of Algeria")))
        self.graph.add((algiers, self.ETOUR.locatedIn, algeria))
        
        paris = self.EX.Paris
        self.graph.add((paris, RDF.type, self.ETOUR.City))
        self.graph.add((paris, self.ETOUR.name, Literal("Paris", lang="en")))
        self.graph.add((paris, self.ETOUR.locatedIn, france))
        
        print(f"  ✓ Created {3} countries and cities")
        
        # Tourist Attractions
        santacruz = self.EX.FortSantaCruz
        self.graph.add((santacruz, RDF.type, self.ETOUR.Monument))
        self.graph.add((santacruz, self.ETOUR.name, Literal("Fort Santa Cruz")))
        self.graph.add((santacruz, self.ETOUR.description, 
                       Literal("Historic fortress overlooking Oran bay")))
        self.graph.add((santacruz, self.ETOUR.locatedIn, oran))
        self.graph.add((santacruz, self.ETOUR.rating, Literal(4.5, datatype=XSD.float)))
        self.graph.add((santacruz, self.ETOUR.openingHours, Literal("9:00-17:00")))
        
        bardo = self.EX.BardoMuseum
        self.graph.add((bardo, RDF.type, self.ETOUR.Museum))
        self.graph.add((bardo, self.ETOUR.name, Literal("Bardo National Museum")))
        self.graph.add((bardo, self.ETOUR.description, 
                       Literal("Museum of prehistory and ethnography")))
        self.graph.add((bardo, self.ETOUR.locatedIn, algiers))
        self.graph.add((bardo, self.ETOUR.rating, Literal(4.2, datatype=XSD.float)))
        self.graph.add((bardo, self.ETOUR.openingHours, Literal("10:00-18:00")))
        
        madagh = self.EX.MadaghBeach
        self.graph.add((madagh, RDF.type, self.ETOUR.Beach))
        self.graph.add((madagh, self.ETOUR.name, Literal("Madagh Beach")))
        self.graph.add((madagh, self.ETOUR.description, 
                       Literal("Popular beach near Oran")))
        self.graph.add((madagh, self.ETOUR.locatedIn, oran))
        self.graph.add((madagh, self.ETOUR.rating, Literal(4.0, datatype=XSD.float)))
        
        print(f"  ✓ Created {3} tourist attractions")
        
        # Hotels
        sheraton = self.EX.SheratonOran
        self.graph.add((sheraton, RDF.type, self.ETOUR.Hotel))
        self.graph.add((sheraton, self.ETOUR.name, Literal("Sheraton Oran Hotel")))
        self.graph.add((sheraton, self.ETOUR.description, 
                       Literal("5-star hotel with sea views")))
        self.graph.add((sheraton, self.ETOUR.locatedIn, oran))
        self.graph.add((sheraton, self.ETOUR.rating, Literal(4.6, datatype=XSD.float)))
        self.graph.add((sheraton, self.ETOUR.priceRange, Literal("$$$")))
        self.graph.add((sheraton, self.ETOUR.capacity, Literal(300, datatype=XSD.integer)))
        self.graph.add((sheraton, self.ETOUR.hasEmail, Literal("info@sheraton-oran.com")))
        self.graph.add((sheraton, self.ETOUR.hasPhone, Literal("+213-41-123456")))
        self.graph.add((sheraton, self.ETOUR.nearTo, santacruz))
        
        ibis = self.EX.IbisOran
        self.graph.add((ibis, RDF.type, self.ETOUR.Hotel))
        self.graph.add((ibis, self.ETOUR.name, Literal("Ibis Oran")))
        self.graph.add((ibis, self.ETOUR.description, 
                       Literal("Budget-friendly hotel in city center")))
        self.graph.add((ibis, self.ETOUR.locatedIn, oran))
        self.graph.add((ibis, self.ETOUR.rating, Literal(3.8, datatype=XSD.float)))
        self.graph.add((ibis, self.ETOUR.priceRange, Literal("$$")))
        self.graph.add((ibis, self.ETOUR.capacity, Literal(150, datatype=XSD.integer)))
        
        royal = self.EX.RoyalHotelAlgiers
        self.graph.add((royal, RDF.type, self.ETOUR.Hotel))
        self.graph.add((royal, self.ETOUR.name, Literal("Royal Hotel Algiers")))
        self.graph.add((royal, self.ETOUR.locatedIn, algiers))
        self.graph.add((royal, self.ETOUR.rating, Literal(4.3, datatype=XSD.float)))
        self.graph.add((royal, self.ETOUR.priceRange, Literal("$$$")))
        self.graph.add((royal, self.ETOUR.capacity, Literal(200, datatype=XSD.integer)))
        
        print(f"  ✓ Created {3} hotels")
        
        # Restaurants
        le_mirage = self.EX.LeMirage
        self.graph.add((le_mirage, RDF.type, self.ETOUR.Restaurant))
        self.graph.add((le_mirage, self.ETOUR.name, Literal("Le Mirage")))
        self.graph.add((le_mirage, self.ETOUR.description, 
                       Literal("Seafood restaurant with Mediterranean cuisine")))
        self.graph.add((le_mirage, self.ETOUR.locatedIn, oran))
        self.graph.add((le_mirage, self.ETOUR.rating, Literal(4.4, datatype=XSD.float)))
        self.graph.add((le_mirage, self.ETOUR.priceRange, Literal("$$")))
        self.graph.add((le_mirage, self.ETOUR.openingHours, Literal("12:00-23:00")))
        
        # Link hotel to restaurant (service)
        self.graph.add((sheraton, self.ETOUR.offers, le_mirage))
        
        print(f"  ✓ Created {1} restaurant")
        
        # Activities
        city_tour = self.EX.OranCityTour
        self.graph.add((city_tour, RDF.type, self.ETOUR.Tour))
        self.graph.add((city_tour, self.ETOUR.name, Literal("Oran City Tour")))
        self.graph.add((city_tour, self.ETOUR.description, 
                       Literal("Guided tour of Oran's historical sites")))
        self.graph.add((city_tour, self.ETOUR.duration, Literal(180, datatype=XSD.integer)))
        self.graph.add((city_tour, self.ETOUR.price, Literal(50.0, datatype=XSD.float)))
        self.graph.add((oran, self.ETOUR.hasActivity, city_tour))
        
        cultural_event = self.EX.OranFestival
        self.graph.add((cultural_event, RDF.type, self.ETOUR.Event))
        self.graph.add((cultural_event, self.ETOUR.name, Literal("Oran Music Festival")))
        self.graph.add((cultural_event, self.ETOUR.description, 
                       Literal("Annual music festival featuring Rai music")))
        self.graph.add((cultural_event, self.ETOUR.duration, Literal(240, datatype=XSD.integer)))
        self.graph.add((cultural_event, self.ETOUR.price, Literal(30.0, datatype=XSD.float)))
        self.graph.add((oran, self.ETOUR.hasActivity, cultural_event))
        
        print(f"  ✓ Created {2} activities")
        
        total_triples = len(self.graph)
        print(f"\n✓ Total triples in graph: {total_triples}")
    
    def serialize_graph(self, output_path):
        """
        Step 3: Serialize the complete graph to file
        """
        try:
            # Ensure output directory exists
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            
            # Serialize to Turtle format
            self.graph.serialize(destination=output_path, format="turtle")
            print(f"\n✓ Graph serialized to: {output_path}")
            
            # Get file size
            size_kb = os.path.getsize(output_path) / 1024
            print(f"  File size: {size_kb:.2f} KB")
        except Exception as e:
            print(f"✗ Error serializing graph: {e}")
            raise
    
    def query_graph(self, sparql_query, description=""):
        """
        Execute a SPARQL query on the graph
        """
        if description:
            print(f"\n--- {description} ---")
        
        try:
            results = self.graph.query(sparql_query)
            return results
        except Exception as e:
            print(f"✗ Query error: {e}")
            return None
    
    def print_statistics(self):
        """Print graph statistics"""
        print("\n--- Knowledge Graph Statistics ---")
        
        # Count by class
        class_counts = {}
        classes = [
            ("Country", self.ETOUR.Country),
            ("City", self.ETOUR.City),
            ("Hotel", self.ETOUR.Hotel),
            ("Museum", self.ETOUR.Museum),
            ("Monument", self.ETOUR.Monument),
            ("Beach", self.ETOUR.Beach),
            ("Restaurant", self.ETOUR.Restaurant),
            ("Tour", self.ETOUR.Tour),
            ("Event", self.ETOUR.Event)
        ]
        
        for name, class_uri in classes:
            count = len(list(self.graph.subjects(RDF.type, class_uri)))
            if count > 0:
                class_counts[name] = count
                print(f"  {name}: {count}")
        
        print(f"\n  Total instances: {sum(class_counts.values())}")
        print(f"  Total triples: {len(self.graph)}")


def main():
    """Main pipeline execution"""
    print("="*60)
    print("TP2 - Knowledge Graph Pipeline for e-Tourism")
    print("="*60)
    
    # Initialize KG
    kg = ETourismKG()
    
    # Step 1: Load ontology (T-Box)
    print("\n[STEP 1] Loading Ontology...")
    ontology_path = "ontology/etourism_ontology.ttl"
    kg.load_ontology(ontology_path)
    
    # Step 2: Create instances (A-Box)
    print("\n[STEP 2] Creating Instances...")
    kg.create_instances()
    
    # Step 3: Serialize graph
    print("\n[STEP 3] Serializing Knowledge Graph...")
    output_path = "output/etourism_complete.ttl"
    kg.serialize_graph(output_path)
    
    # Step 4: Print statistics
    kg.print_statistics()
    
    print("\n" + "="*60)
    print("✓ Pipeline execution completed successfully!")
    print("="*60)
    print(f"\nNext steps:")
    print(f"  1. Review the generated file: {output_path}")
    print(f"  2. Load into Fuseki for SPARQL endpoint")
    print(f"  3. Run advanced SPARQL queries")
    

if __name__ == "__main__":
    main()
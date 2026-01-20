# Setup script for TP2 - Knowledge Graph e-Tourism
# Run this in your project directory

# Create project structure
mkdir -p tp2_kg_etourism
cd tp2_kg_etourism

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install required libraries
pip install rdflib==7.0.0
pip install SPARQLWrapper==2.0.0

# Create project directories
mkdir -p ontology
mkdir -p data
mkdir -p queries
mkdir -p output

# Create requirements.txt
cat > requirements.txt << EOF
rdflib==7.0.0
SPARQLWrapper==2.0.0
EOF

echo "Environment setup complete!"
echo "Project structure created:"
echo "  - ontology/  : for ontology files"
echo "  - data/      : for instance data"
echo "  - queries/   : for SPARQL queries"
echo "  - output/    : for generated RDF files"
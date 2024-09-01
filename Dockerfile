FROM ankane/pgvector:v0.5.1

# Set environment variables
ENV POSTGRES_DB=movies
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=your_password

# Copy initialization scripts
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# Start PostgreSQL service
CMD ["postgres"]






# //volumes:
#   - ./init.sql:/docker-entrypoint-initdb.d/init.sql
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app

@pytest_asyncio.fixture
async def ac():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
